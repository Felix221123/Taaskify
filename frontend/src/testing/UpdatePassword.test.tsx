import { screen } from '@testing-library/react';
import { customRender } from '../utils/testingUtils';
import { UpdatePassword } from '../Auth/UpdatePassword';




describe('Update Password Component', () => {
  test('it should display the text in the page for instruction', () => {
    customRender(<UpdatePassword />);

    expect(screen.getByText(/Update Your Taaskify Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Update Your Taaskify Password/i)).toBeVisible();

    expect(screen.getByText(/Please enter your current password and your new password/i)).toBeInTheDocument();
    expect(screen.getByText(/Please enter your current password and your new password/i)).toBeVisible();


    expect(screen.getByLabelText(/Current Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm New Password/i)).toBeInTheDocument();
    expect(screen.getByTestId('updateBtn')).toBeInTheDocument();


  })

})
