pipeline {
  agent any
  environment {
    GITHUB_CREDS = credentials('github-credentials')
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Check Commit Message') {
      steps {
        script {
          def commitMsg = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
          if (commitMsg.contains("@push")) {
            echo "Triggering GitHub push..."
          } else {
            error("Commit message does not contain '@push'. Aborting.")
          }
        }
      }
    }
    stage('Build') {
      steps {
        sh 'echo "Building..."'
      }
    }
    stage('Test') {
      steps {
        sh 'echo "Running tests..."'
      }
    }
    stage('Push to GitHub') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'github-credentials',
          usernameVariable: 'GITHUB_USER',
          passwordVariable: 'GITHUB_TOKEN'
        )]) {
          sh '''
            git remote set-url origin https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/pomegranateis/DSO101_SE_project.git
            git push origin HEAD:main
          '''
        }
      }
    }
  }
}
