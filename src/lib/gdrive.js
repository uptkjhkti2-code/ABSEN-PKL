import { google } from 'googleapis'
import stream from 'stream'

export async function uploadToGoogleDrive(base64Image, fileName) {
  try {
    // Check if credentials exist
    if (!process.env.GDRIVE_CLIENT_EMAIL || !process.env.GDRIVE_PRIVATE_KEY || !process.env.GDRIVE_FOLDER_ID) {
      console.warn("Google Drive credentials not set. Returning a placeholder URL for MVP testing.");
      return "https://placeholder.url/gdrive-not-configured"
    }

    let rawKey = process.env.GDRIVE_PRIVATE_KEY || ''
    // Jika user copy-paste dengan tanda kutip di Vercel, kita bersihkan
    if (rawKey.startsWith('"') && rawKey.endsWith('"')) {
      rawKey = rawKey.slice(1, -1)
    }
    if (rawKey.startsWith("'") && rawKey.endsWith("'")) {
      rawKey = rawKey.slice(1, -1)
    }
    const privateKey = rawKey.replace(/\\n/g, '\n')

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GDRIVE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    })

    const drive = google.drive({ version: 'v3', auth })

    // Extract base64 data
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "")
    const buffer = Buffer.from(base64Data, 'base64')
    
    // Create a stream from buffer
    const bufferStream = new stream.PassThrough()
    bufferStream.end(buffer)

    const fileMetadata = {
      name: fileName,
      parents: [process.env.GDRIVE_FOLDER_ID],
    }

    const media = {
      mimeType: 'image/jpeg',
      body: bufferStream,
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    })

    // Wait for permissions to make it accessible if needed, 
    // or assume the folder is shared with "Anyone with the link"

    return response.data.webViewLink
  } catch (error) {
    console.error("Error uploading to Google Drive:", error)
    throw new Error(error.message || "Gagal mengupload foto ke Google Drive")
  }
}
