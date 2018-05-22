export class UtilsPassword{
  public static passwordPattern = "(?=^.{6,}$)(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$";
  public static passwordValidationMessage = "Latin upper and lowercase letters, digits, not shorter than 6 symbols";
}
