import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AITutor from './AITutor';
import axios from 'axios';
import { describe, it, expect, vi } from 'vitest';

vi.mock('axios');

window.HTMLElement.prototype.scrollIntoView = function() {};

const mockUser = { name: 'Test User', goal: 'Learn Testing' };

describe('AITutor Component', () => {
  it('renders the initial greeting', () => {
    render(<AITutor user={mockUser} />);
    expect(screen.getByText(/Hello Test User/i)).toBeInTheDocument();
  });

  it('sends a message and displays loading state, then response', async () => {
    axios.post.mockResolvedValueOnce({ data: { response: 'This is a mock AI response.' } });
    
    render(<AITutor user={mockUser} />);
    
    const input = screen.getByPlaceholderText(/Ask anything about your learning path/i);
    const sendButton = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(input, { target: { value: 'What is testing?' } });
    fireEvent.click(sendButton);

    expect(screen.getByText(/Lumina is thinking.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/This is a mock AI response./i)).toBeInTheDocument();
    });
  });
  
  it('toggles language correctly', () => {
    render(<AITutor user={mockUser} />);
    const langButton = screen.getByRole('button', { name: /Toggle language/i });
    expect(langButton).toHaveTextContent('English');
    
    fireEvent.click(langButton);
    expect(langButton).toHaveTextContent('Spanish');
  });
});
