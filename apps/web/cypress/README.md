# Cypress E2E Tests

This directory contains end-to-end tests for the Pokédex application using Cypress.

## Test Structure

### Test Files

- **`auth.cy.ts`** - Authentication flow tests (register, login, logout, validation)
- **`pokemon.cy.ts`** - Pokemon listing, filtering, and detail page tests
- **`teams.cy.ts`** - Team management tests (create, view, edit, delete)
- **`user-journey.cy.ts`** - Complete user journey test covering all major features

### Support Files

- **`support/commands.ts`** - Custom Cypress commands for common actions
- **`support/e2e.ts`** - Global configuration and setup

### Fixtures

- **`fixtures/users.json`** - Test user data
- **`fixtures/teams.json`** - Test team data

## Test Coverage

The e2e tests cover the following user flows:

### 1. Authentication
- ✅ User registration with validation
- ✅ User login with valid/invalid credentials
- ✅ User logout
- ✅ Protected route access control
- ✅ Form validation errors

### 2. Pokemon Features
- ✅ Display list of Pokemon
- ✅ Filter Pokemon by name (search)
- ✅ Filter Pokemon by type
- ✅ Combine multiple filters
- ✅ Navigate to Pokemon detail page
- ✅ View Pokemon stats and information
- ✅ Navigate back from detail page
- ✅ Handle pagination

### 3. Team Management
- ✅ Display teams list (with empty state)
- ✅ Create new team with validation
- ✅ View team details
- ✅ Edit team information
- ✅ Delete team with confirmation
- ✅ Add Pokemon to team
- ✅ Handle form validation errors
- ✅ Cancel operations

### 4. Complete User Journey
- ✅ Full workflow from registration to team deletion
- ✅ Cross-feature integration testing

## Running the Tests

### Prerequisites

1. Ensure the development server is running:
   ```bash
   npm run dev
   ```

2. Ensure the API server is running (if using real backend):
   ```bash
   cd ../api
   npm run dev
   ```

### Running Tests

#### Interactive Mode (Cypress UI)
```bash
npm run e2e:open
# or
npm run cypress:open
```

#### Headless Mode (CI/Command Line)
```bash
npm run e2e
# or
npm run cypress:run
```

### Test Configuration

The tests are configured to run against `http://localhost:5173` by default. This can be changed in `cypress.config.ts`.

## Test Data Requirements

### Data-testid Attributes

The tests rely on `data-testid` attributes in the UI components. Ensure the following test IDs are present in your components:

#### Authentication
- `email-input`
- `password-input`
- `confirm-password-input`
- `login-button`
- `register-button`
- `logout-button`
- `user-menu`
- `error-message`
- `success-message`

#### Pokemon
- `pokemon-list`
- `pokemon-card`
- `search-input`
- `type-filter`
- `pagination`
- `next-page`
- `prev-page`
- `pokemon-name`
- `pokemon-image`
- `pokemon-stats`
- `pokemon-types`
- `back-button`
- `add-to-team-button`

#### Teams
- `teams-list`
- `team-card`
- `create-team-button`
- `team-name-input`
- `team-description-input`
- `save-team-button`
- `cancel-button`
- `edit-team-button`
- `delete-team-button`
- `team-menu`
- `delete-confirmation-dialog`
- `confirm-delete-button`
- `add-pokemon-button`
- `pokemon-selector`
- `team-pokemon`
- `pokemon-count`

### Authentication Setup

The tests assume:
1. Registration creates a user and logs them in automatically
2. Login redirects to `/teams`, `/dashboard`, or `/pokemon` on success
3. Logout redirects to `/login`
4. Protected routes redirect to `/login` when not authenticated

## Custom Commands

### Available Commands

- **`cy.login(email, password)`** - Login with credentials
- **`cy.register(email, password, confirmPassword?)`** - Register new user
- **`cy.logout()`** - Logout current user
- **`cy.waitForPageLoad()`** - Wait for page to fully load

### Example Usage

```typescript
// Login before test
cy.login('test@example.com', 'password123')

// Register new user
cy.register('new@example.com', 'newpassword123')

// Wait for page to load
cy.waitForPageLoad()
```

## Best Practices

1. **Test Independence**: Each test should be independent and not rely on state from other tests
2. **Data Cleanup**: Tests clean up their own data (create/delete teams as needed)
3. **Realistic User Flows**: Tests simulate actual user interactions
4. **Error Handling**: Tests verify both success and error scenarios
5. **Responsive Design**: Tests use appropriate selectors that work across screen sizes

## Troubleshooting

### Common Issues

1. **Test timing out**: Increase timeout values in `cypress.config.ts`
2. **Elements not found**: Verify `data-testid` attributes are present
3. **Authentication issues**: Check if auth flow matches test expectations
4. **API errors**: Ensure backend is running and accessible

### Debugging

1. Use `cy.pause()` to pause test execution
2. Use browser dev tools in Cypress UI
3. Check network requests in Cypress UI
4. Review screenshots for failed tests
5. Enable video recording for detailed failure analysis

## Contributing

When adding new features:

1. Add appropriate `data-testid` attributes to new components
2. Update existing tests if UI changes affect them
3. Add new test cases for new functionality
4. Update this README if new test patterns are introduced