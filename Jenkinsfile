pipeline {
    agent any
    environment {
        DOCKER_USER = 'jho42'
        VERSION = "v${env.BUILD_NUMBER}"
        SONAR_URL = 'http://sonarqube:9000'
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
                sh 'rm -rf ${WORKSPACE}/.scannerwork && mkdir -p ${WORKSPACE}/.scannerwork && chmod 777 ${WORKSPACE}/.scannerwork'
                withSonarQubeEnv('SonarQube') {
                    withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_AUTH_TOKEN')]) {
                        sh """
                            docker run --rm \
                            --network="devops-network" \
                            -v "${WORKSPACE}:/usr/src" \
                            -v "${WORKSPACE}/.scannerwork:/tmp/.scannerwork" \
                            -e SONAR_TOKEN=\$SONAR_AUTH_TOKEN \
                            -e SONAR_SCANNER_OPTS="-Xmx1g" \
                            sonarsource/sonar-scanner-cli \
                            -Dsonar.projectKey=mon-projet-devops \
                            -Dsonar.projectName="Mon Projet DevOps" \
                            -Dsonar.host.url=${SONAR_URL} \
                            -Dsonar.sources=. \
                            -Dsonar.exclusions=**/node_modules/**,**/.next/**,**/*.js,**/*.ts,**/*.tsx,**/*.jsx,**/*.css,**/*.json \
                            -Dsonar.language=yaml,docker \
                            -Dsonar.scanner.socketTimeout=600
                        """
                    }
                }
            }
        }

        stage('4. Validation de la Quality Gate') {
            steps {
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
                withCredentials([string(credentialsId: 'docker-hub-credentials', variable: 'DOCKER_HUB_TOKEN')]) {
                    sh "echo \$DOCKER_HUB_TOKEN | docker login -u ${DOCKER_USER} --password-stdin"
                    sh "docker push ${DOCKER_USER}/mon-projet-devops-frontend:${VERSION}"
                    sh "docker push ${DOCKER_USER}/mon-projet-devops-backend:${VERSION}"
                    sh "docker logout"
                }
            }
        }
    }

    post {
        always {
            sh 'rm -rf ${WORKSPACE}/.scannerwork || true'
            echo '=== Fin de l\'exécution du pipeline ==='
        }
        success {
            echo '=== Pipeline terminé avec succès ==='
        }
        failure {
            echo '=== Pipeline en échec — vérifier les logs ==='
        }
    }
}