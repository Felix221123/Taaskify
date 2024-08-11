export interface ProfileProps {
  firstName: string;
  lastName: string;
  onClickProps: () => void;
}

export interface SettingsProfileProps {
  firstName: string;
  lastName: string;
  emailAddress: string;
  onClickProp?: () => void;
  isLoggingOut:(loggedOut:string) => void
}
