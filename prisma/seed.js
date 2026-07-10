const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)
  const studentPassword = await bcrypt.hash('siswa123', 10)

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      name: 'Administrator',
      password: adminPassword,
      role: 'ADMIN'
    },
  })

  // Create Student
  const student = await prisma.user.upsert({
    where: { username: 'siswa01' },
    update: {},
    create: {
      username: 'siswa01',
      name: 'Budi Santoso',
      password: studentPassword,
      kelas: 'XII TKJ 1',
      dudika: 'PT. Maju Mundur (Bengkel AHASS)',
      role: 'STUDENT'
    },
  })

  console.log({ admin, student })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
