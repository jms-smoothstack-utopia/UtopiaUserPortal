pipeline {
  agent any
  stages {
    stage('Install dependencies') {
      steps {
        sh 'npm i'
      }
    }
    stage('Test') {
      steps {
        sh 'npx ng test --watch=false'
      }
    }
    stage('Build and push DEV to S3') {
      when {
        branch 'dev'
      }
      steps {
        sh 'npx ng build --prod'
        sh 'aws s3 rm s3://dev.utopia-air.click --recursive'
        sh 'aws s3 cp ./dist/UtopiaUserPortal s3://dev.utopia-air.click --recursive'
      }
    }
    stage('Build and push MAIN to S3') {
      when {
        branch 'main'
      }
      steps {
        sh 'npx ng build --prod'
        sh 'aws s3 cp ./dist/UtopiaUserPortal s3://utopia-air.click --recursive'
      }
    }
  }
}
