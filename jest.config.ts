import nextJest from 'next/jest'

const createJestConfig = nextJest({ dir: './' })

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Se estiver usando @ como alias
    '\\.(scss|sass|css)$': 'identity-obj-proxy', // Ignorar imports de estilos
  },
  testEnvironment: 'jsdom',
}

export default createJestConfig(customJestConfig)
