const nextJest = require('next/jest')

// Indique le chemin de ton application Next.js
const createJestConfig = nextJest({
  dir: './',
})

// Configuration personnalisée de Jest
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)