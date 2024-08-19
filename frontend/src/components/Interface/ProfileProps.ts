export interface ProfileProps {
  firstName: string;
  lastName: string;
  onClickProps: () => void;
}

export interface SettingsProfileProps {
  firstName: string;
  lastName: string;
  emailAddress: string;
  isLoggingOut:(loggedOut:string) => void
}
