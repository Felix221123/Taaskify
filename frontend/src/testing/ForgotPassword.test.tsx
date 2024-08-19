import { screen } from '@testing-library/react';
import { customRender } from '../utils/testingUtils';
import { ForgotPassword } from '../Auth/ForgotPassword';



describe('Forgot Password Component', () => {
  test('it should display the forgot password component', () => {
    customRender(<ForgotPassword />);

    expect(screen.getByText(/Reset Password/i)).toBeInTheDocument()
    expect(screen.getByText(/Please enter your email to receive a verification link to reset your email/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/Enter your Email/i)).toBeInTheDocument();

    expect(screen.getByTestId("sendEmailBtn")).toBeInTheDocument();

  })

})
