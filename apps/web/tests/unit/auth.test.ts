import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInForm } from "@/features/auth/components/SignInForm";
import { SignUpForm } from "@/features/auth/components/SignUpForm";

// Mock NextAuth
jest.mock("next-auth/react", () => ({
  useSession() {
    return {
      data: null,
      status: "unauthenticated",
    };
  },
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
}));

describe("Authentication Components", () => {
  describe("SignInForm", () => {
    it("should render sign in form with all required fields", () => {
      render(<SignInForm />);

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign in/i })
      ).toBeInTheDocument();
    });

    it("should validate required fields", async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/username is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it("should validate password minimum length", async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      const usernameInput = screen.getByLabelText(/username/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "123");

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/password must be at least 6 characters/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("SignUpForm", () => {
    it("should render sign up form with all required fields", () => {
      render(<SignUpForm />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /create account/i })
      ).toBeInTheDocument();
    });

    it("should validate required fields", async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/name must be at least 2 characters/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/username is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it("should validate name minimum length", async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, "a");

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/name must be at least 2 characters/i)
        ).toBeInTheDocument();
      });
    });

    it("should validate username minimum length", async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const usernameInput = screen.getByLabelText(/username/i);
      await user.type(usernameInput, "ab");

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/username must be at least 3 characters/i)
        ).toBeInTheDocument();
      });
    });

    it("should validate password confirmation match", async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const nameInput = screen.getByLabelText(/name/i);
      const usernameInput = screen.getByLabelText(/username/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      await user.type(nameInput, "Test User");
      await user.type(usernameInput, "testuser");
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "password456");

      const submitButton = screen.getByRole("button", {
        name: /create account/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
      });
    });
  });
});
