import { screen } from '@testing-library/react';
import { customRender } from '../utils/testingUtils';
import { ResetPassword } from '../Auth/ResetPassword';



describe('Reset Password Component', () => {

  test('it should display the input fields on the page', () => {
    customRender(<ResetPassword />);

    expect(screen.getByText(/Reset Your Taaskify Password/i)).toBeInTheDocument()
    expect(screen.getByText(/Please enter your new password to reset your Taaskify account/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/Confirm New Password/i)).toBeInTheDocument();

    expect(screen.getByTestId("resetBtn")).toBeInTheDocument();

  })


})
