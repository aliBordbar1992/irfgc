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

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
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
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it("should validate email format", async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, "invalid-email");

      const submitButton = screen.getByRole("button", { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/please enter a valid email address/i)
        ).toBeInTheDocument();
      });
    });

    it("should validate password minimum length", async () => {
      const user = userEvent.setup();
      render(<SignInForm />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await user.type(emailInput, "test@example.com");
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
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign up/i })
      ).toBeInTheDocument();
    });

    it("should validate required fields", async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const submitButton = screen.getByRole("button", { name: /sign up/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/name must be at least 2 characters/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it("should validate name minimum length", async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, "a");

      const submitButton = screen.getByRole("button", { name: /sign up/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/name must be at least 2 characters/i)
        ).toBeInTheDocument();
      });
    });

    it("should validate password confirmation match", async () => {
      const user = userEvent.setup();
      render(<SignUpForm />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

      await user.type(nameInput, "Test User");
      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.type(confirmPasswordInput, "password456");

      const submitButton = screen.getByRole("button", { name: /sign up/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });
  });
});
