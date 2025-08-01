export const mockUser = {
  id: "user-1",
  email: "test@example.com",
  created_at: new Date("2024-01-01"),
  updated_at: new Date("2024-01-01"),
};

export const mockAuthResponse = {
  user: {
    user: mockUser,
  },
};

export const createMockUser = (overrides = {}) => ({
  id: "mock-user-id",
  email: "mock@example.com",
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides,
});
