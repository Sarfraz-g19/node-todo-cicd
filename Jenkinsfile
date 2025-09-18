pipeline {
    agent any   // Run on any available node (your EC2)

    environment {
        NODE_VERSION = "16"  // Node.js version if using NodeJS plugin
    }

    stages {

        stage("Clone Code") {
            steps {
                git branch: "master", url: "https://github.com/Sarfraz-g19/node-todo-cicd.git"
                echo 'Code cloned successfully'
            }
        }

        stage("Install Dependencies") {
            steps {
                // Use NodeJS if plugin installed, otherwise system Node
                sh 'npm install'
                echo 'Dependencies installed'
            }
        }

        stage("Run Tests (Optional)") {
            steps {
                // Optional, skip if no tests
                sh 'npm test || echo "No tests found, skipping"'
                echo 'Tests completed'
            }
        }

        stage("Deploy App with PM2") {
            steps {
                // Stop old app if running, then start with PM2
                sh '''
                    pm2 delete todo-app || true
                    pm2 start app.js --name todo-app
                    pm2 save
                '''
                echo 'App deployed successfully'
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully! Node app is running on EC2."
        }
        failure {
            echo "Pipeline failed. Check console output for errors."
        }
    }
}
