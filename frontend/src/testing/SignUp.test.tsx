import { LogIn } from "../Auth/LogIn";
import { SignUp } from "../Auth/SignUp";
import { customRender } from "../utils/testingUtils";
import { fireEvent, screen } from "@testing-library/react";
import { describe, it, } from 'vitest';


describe('SignUp Component', () => {
  it('renders the sign up form correctly', () => {
    customRender(<SignUp onSignUpSuccessful={() => {}}/>);

    // Check if the main title is rendered
    expect(screen.getByText('Sign Up to Taaskify')).toBeInTheDocument();

    // Check if the subtext is rendered
    expect(screen.getByText('Please fill the info to sign up')).toBeInTheDocument();

    // Check if the first name label and input are rendered
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();

    // Check if the last name label and input are rendered
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();

    // Check if the email label and input are rendered
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your Email')).toBeInTheDocument();

    // Check if the password label and input are rendered
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Create your Password')).toBeInTheDocument();

    // Check if the confirm password label and input are rendered
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm your Password')).toBeInTheDocument();

    // Check if the sign-up button is rendered
    expect(screen.getByText('Sign Up')).toBeInTheDocument();

    // Check if the log-in prompt is rendered
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });
});


describe('Renders login component', () => {
  test('it should render the login component when the login  btn clicked', () => {
    customRender(<SignUp onSignUpSuccessful={() => {}}/>)
    customRender(<LogIn onLogInSuccessful={() => {}}/>)

    const loginBtn = screen.getByTestId("loginBtn")
    fireEvent.click(loginBtn);

    expect(screen.getByTestId("loginContainer")).toBeInTheDocument()
  })
})



// testing the sign up functionality

