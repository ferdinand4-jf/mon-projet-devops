import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Page from '../app/page';

beforeEach(() => {
  // On mock globalement le fetch
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Home Page - DevOps Project', () => {

  test('affiche le titre principal et les éléments du formulaire', async () => {
    jest.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => [],
    } as Response);

    render(<Page />);

    // En utilisant "findBy", Jest attend que le cycle asynchrone (le fetch et le setTasks) 
    // soit totalement terminé avant de valider. Cela intègre implicitement le "act()".
    expect(
      await screen.findByText('Mon Projet DevOps (Next.js + Express)')
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('Nouvelle tâche...')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Ajouter' })
    ).toBeInTheDocument();
  });

  test('affiche le message liste vide quand l\'API retourne aucun élément', async () => {
    jest.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => [],
    } as Response);

    render(<Page />);

    const emptyMessage = await screen.findByText('Aucune tâche pour le moment.');
    expect(emptyMessage).toBeInTheDocument();
  });

  test('affiche la liste des tâches quand l\'API retourne des données', async () => {
    const mockTasks = [
      { id: 1, title: 'Configurer la CI/CD' },
      { id: 2, title: 'Créer l\'image Docker' }
    ];

    jest.mocked(global.fetch).mockResolvedValueOnce({
      json: async () => mockTasks,
    } as Response);

    render(<Page />);

    expect(await screen.findByText('Configurer la CI/CD')).toBeInTheDocument();
    expect(screen.getByText('Créer l\'image Docker')).toBeInTheDocument();
    expect(screen.queryByText('Aucune tâche pour le moment.')).not.toBeInTheDocument();
  });

});