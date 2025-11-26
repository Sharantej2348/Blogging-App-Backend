pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                echo 'Installing npm packages...'
                bat 'npm ci'       // or: bat "npm install"
            }
        }

        stage('Build') {
            steps {
                echo 'Building project...'
                bat 'npm run build'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                bat 'npm test'
            }
        }
    }

    post {
        success {
            echo '✅ Build & tests succeeded!'
        }
        failure {
            echo '❌ Build or tests failed. Check console output.'
        }
    }
}
