pipeline{
    agent any 
    
    stages{
        stage("git checkout") {
         steps {
             git url: "https://github.com/naveen-rahul-roy/wehr", branch: "main"
         }
        }
        stage("Installation"){
            steps{
                sh 'npm install'
            }
        }
        stage("testing the application"){
            steps{
                sh 'npm test'
            }
        }
        stage("Building"){
            steps{
                sh 'npm run build'
            }
        }
    }
    
    post{
       success {echo "Build Succesfull"}
       failure {echo "Build failure"}
    }

}
