pipeline {
    agent any 
    
//tools {
       // nodejs "NodeJs-lts"
    //}
    
    stages{
        stage("Installing Dependencies") {
            steps {
                sh 'npm install'
            }
        }
        stage("Testing Dependencies") {
            steps {
                sh "npm test"
            }
        }
    }
    post {
        success {
            echo "Build Succesfull..!"
        }
        failure {
            echo "Build Failed..!"
        }
    }
     
}





