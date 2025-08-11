// Mock authentication for testing without Supabase
export const mockAuth = {
  signIn: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock users for testing
    const mockUsers = [
      { email: 'customer@test.com', password: 'password', role: 'customer' },
      { email: 'pro@test.com', password: 'password', role: 'pro' },
      { email: 'admin@test.com', password: 'password', role: 'admin' },
    ];
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Store mock session in localStorage
    localStorage.setItem('mockUser', JSON.stringify({
      id: Math.random().toString(36),
      email: user.email,
      role: user.role,
      first_name: 'Test',
      last_name: 'User'
    }));
    
    return { user };
  },
  
  signUp: async (email: string, password: string, userData: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful signup
    return { 
      user: { 
        id: Math.random().toString(36),
        email,
        ...userData 
      } 
    };
  },
  
  getCurrentUser: () => {
    const stored = localStorage.getItem('mockUser');
    return stored ? JSON.parse(stored) : null;
  },
  
  signOut: () => {
    localStorage.removeItem('mockUser');
  }
};