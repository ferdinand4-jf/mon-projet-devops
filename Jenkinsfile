pipeline {
    agent any

    environment {
        // Paramètres Docker Hub
        DOCKER_USER = 'jho42' // Mettre ton vrai pseudo Docker Hub
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials')
        VERSION = "v${env.BUILD_NUMBER}"
        
        // Paramètre SonarQube
        SONAR_URL = 'http://localhost:9000'
    }

    stages {
        stage('1. Récupération du Code') {
            steps {
                checkout scm
            }
        }

        stage('2. Tests Unitaires') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                            sh 'npm test'
                        }
                    }
                }
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            sh 'npm install'
                            sh 'npm test'
                        }
                    }
                }
            }
        }

        stage('3. Analyse DevSecOps (SonarQube)') {
            steps {
                echo '=== Analyse statique du code en cours ==='
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_AUTH_TOKEN')]) {
                    // Utilisation du conteneur officiel sonar-scanner pour auditer le projet
                    sh """
                        docker run --rm \
                        --network="devops-network" \
                        -v "${WORKSPACE}:/usr/src" \
                        sonarsource/sonar-scanner-cli \
                        -Dsonar.projectKey=mon-projet-devops \
                        -Dsonar.projectName="Mon Projet DevOps" \
                        -Dsonar.host.url=${SONAR_URL} \
                        -Dsonar.token=${SONAR_AUTH_TOKEN} \
                        -Dsonar.sources=. \
                        -Dsonar.exclusions=**/node_modules/**,**/.next/**
                    """
                }
            }
        }

       stage('4. Validation de la Quality Gate') {
            steps {
                // Le timeout est maintenant correctement placé à l'intérieur de steps
                timeout(time: 5, unit: 'MINUTES') {
                    echo '=== Vérification des critères de qualité SonarQube ==='
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('5. Production des Images Docker') {
            steps {
                echo '=== Construction des images applicatives ==='
                sh "docker build -t ${DOCKER_USER}/mon-projet-devops-frontend:${VERSION} ./frontend"
                sh "docker build -t ${DOCKER_USER}/mon-projet-devops-backend:${VERSION} ./backend"
            }
        }

        stage('6. Livraison sur Docker Hub') {
            steps {
                echo '=== Authentification et envoi vers le Registre distant ==='
                sh "echo \$DOCKER_CREDENTIALS_PSW | docker login -u \$DOCKER_CREDENTIALS_USR --password-stdin"
                sh "docker push ${DOCKER_USER}/mon-projet-devops-frontend:${VERSION}"
                sh "docker push ${DOCKER_USER}/mon-projet-devops-backend:${VERSION}"
            }
        }
    }

    post {
        always {
            echo '=== Nettoyage de la session d\'exécution ==='
            sh 'docker logout || true'
            sh 'docker image prune -f'
        }
    }
}