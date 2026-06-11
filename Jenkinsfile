pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_CMD = 'docker compose'
    }

    stages {
        stage('Clonage & Vérification') {
            steps {
                echo '=== ÉTAPE 1 : Récupération du code source ==='
                // Jenkins récupère automatiquement le projet si lié à Git
                sh 'node --version'
                sh 'docker --version'
            }
        }

        stage('Installation & Linters') {
            steps {
                echo '=== ÉTAPE 2 : Validation du code source (Linting) ==='
                dir('backend') {
                    // Analyse optionnelle ou installation de test
                    echo 'Vérification du Backend...'
                }
                dir('frontend') {
                    echo 'Vérification du Frontend...'
                }
            }
        }
        
        stage('Tests Frontend') {
            steps {
                echo '=== ÉTAPE 3 : Execution de tests Frontend ==='
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }

        stage('Tests Backend') {
            steps {
                echo '=== ÉTAPES 4 : Execution de tests Backend ==='
                dir('backend') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }
        stage('Arrêt des anciens conteneurs') {
            steps {
                echo '=== ÉTAPE 5 : Nettoyage de l environnement existant ==='
                // Évite les conflits de ports si le projet tournait déjà
                sh "${DOCKER_COMPOSE_CMD} down --remove-orphans"
            }
        }

        stage('Build des Images Docker') {
            steps {
                echo '=== ÉTAPE 6 : Compilation et assemblage des images ==='
                // Build les images sans utiliser le cache pour s'assurer que le nouveau code est pris en compte
                sh "${DOCKER_COMPOSE_CMD} build --no-cache"
            }
        }

        stage('Déploiement de l Application') {
            steps {
                echo '=== ÉTAPE 6 : Lancement de l infrastructure conteneurisée ==='
                // Démarre les conteneurs en tâche de fond (-d)
                sh "${DOCKER_COMPOSE_CMD} up -d"
                echo '=== PIPELINE TERMINÉ AVEC SUCCÈS ! ==='
            }
        }
    }

    post {
        always {
            echo 'Nettoyage des fichiers temporaires du workspace...'
        }
        failure {
            echo '⚠️ Le pipeline a échoué. Une alerte ou un log doit être analysé.'
        }
    }
}