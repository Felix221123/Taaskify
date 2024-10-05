import { screen, fireEvent } from '@testing-library/react';
import { customRender } from "../utils/testingUtils";
import { LandingPage } from '../Page/LandingPage';
import { LogIn } from '../Auth/LogIn';
import { SignUp } from '../Auth/SignUp';
import { describe, expect , test} from 'vitest';


describe('Landing Page', () => {
  test('it should display the header and hero section', () => {
    customRender(<LandingPage />);
    customRender(<LogIn onLogInSuccessful={() => {}}/>);
    customRender(<SignUp onSignUpSuccessful={() => { }}/>)
    expect(screen.getByTestId("appName")).toBeInTheDocument();

    const logInLink = screen.getByTestId("logInLink");

    fireEvent.click(logInLink);

    expect(screen.getByTestId("loginContainer")).toBeInTheDocument();

    expect(screen.getByText(/Manage Tasks Effortlessly with Real-Time Efficiency/i)).toBeInTheDocument();

    const signupLink = screen.getByTestId("signupLink");

    fireEvent.click(signupLink);

    expect(screen.getByTestId("signUpContainer")).toBeInTheDocument();

  })

  test('it should display the features containers and the footer', () => {
    customRender(<LandingPage />);
    expect(screen.getByTestId("mainFeatures")).toBeInTheDocument();
    expect(screen.getByTestId("features")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();

  })


})
