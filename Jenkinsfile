pipeline {
  agent any
  stages {
    stage('Checkout') { steps { git branch: 'main', url: 'YOUR_GITHUB_REPO_URL' } }
    stage('Deploy') { steps { sh 'docker compose down || true'; sh 'docker compose up -d --build' } }
  }
}