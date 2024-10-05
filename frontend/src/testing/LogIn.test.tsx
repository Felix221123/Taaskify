import { LogIn } from "../Auth/LogIn";
import { SignUp } from "../Auth/SignUp";
import { customRender } from "../utils/testingUtils";
import { fireEvent, screen } from "@testing-library/react";
import { describe, it, expect , test} from 'vitest';


describe('LogIn Component', () => {
  it('renders the login form correctly', () => {
    customRender(<LogIn onLogInSuccessful={() => { }} />);

    // Check if the main title is rendered
    expect(screen.getByText('Log In to Taaskify')).toBeInTheDocument();

    // Check if the subtext is rendered
    expect(screen.getByText('Please log in with your email and password')).toBeInTheDocument();

    // Check if the email label and input are rendered
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your Email')).toBeInTheDocument();

    // Check if the password label and input are rendered
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your Password')).toBeInTheDocument();

    // Check if the remember me checkbox and label are rendered
    expect(screen.getByText('Remember me')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toBeInTheDocument();

    // Check if the forgot password link is rendered
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();

    // Check if the sign-in button is rendered
    expect(screen.getByText('Sign In')).toBeInTheDocument();

    // Check if the sign-up prompt is rendered
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
});


describe('It should render the sign up component when the sign up is clicked', () => {
  test('render the login component', () => {
    customRender(<LogIn onLogInSuccessful={() => { }} />);
    customRender(<SignUp onSignUpSuccessful={() => { }} />);

    const signUpBtn = screen.getByTestId("signUpBtn");
    fireEvent.click(signUpBtn);

    expect(screen.getByTestId("signUpContainer")).toBeInTheDocument();
  });
})


describe('Forgot password page', () => {

  test('it should render the forgot password session when clicked', () => {
    customRender(<LogIn onLogInSuccessful={() => { }} />);

    const forgotPassword = screen.getByText(/Forgot password?/i);
    fireEvent.click(forgotPassword);

    expect(screen.getByTestId("forgotPasswordContainer")).toBeInTheDocument();

  })
})
