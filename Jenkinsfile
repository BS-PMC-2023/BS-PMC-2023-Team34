pipeline {
    agent {
        docker {
            image 'node:lts-buster-slim'
            args '-p 3000:3000'
        }
    }
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test'
            }
        }
        stage('Linting') {
            steps {
                sh 'npx eslint . --ext .js'
            }
        }
        stage('Formatting') {
            steps {
                sh 'npx prettier . --write'
            }
        }

    }
}

