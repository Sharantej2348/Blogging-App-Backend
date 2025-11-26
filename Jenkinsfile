pipeline {
    agent any

    tools {
        // Name must match what you configured in:
        // Manage Jenkins → Tools → NodeJS installations
        nodejs 'Node20'
    }

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
                bat 'npm ci'    // or: bat "npm install"
            }
        }

        stage('Build') {
            steps {
                echo 'Building project...'
                // if you don't have a build script, you can temporarily use:
                // bat 'npm run build || echo "no build script"'
                bat 'npm run build'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                // make sure you have "test" script in package.json
                bat 'npm test'
            }
        }
    }

    post {
        success {
            echo '✅ Build & tests succeeded!'
        }
        failure {
            echo '❌ Build or tests failed. Check console output in Jenkins.'
        }
    }
}
