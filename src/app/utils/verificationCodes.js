// Pre-generated 150 verification codes
export const VERIFICATION_CODES = [
  '823491', '567234', '901823', '234567', '789012', '456789', '123098', '890123', '345678', '678901',
  '912345', '234890', '567123', '890456', '123789', '456012', '789345', '012678', '345901', '678234',
  '901567', '234901', '567834', '890167', '123490', '456823', '789156', '012489', '345712', '678045',
  '901378', '234601', '567934', '890267', '123590', '456923', '789256', '012589', '345812', '678145',
  '901478', '234701', '568034', '890367', '123690', '457023', '789356', '012689', '345912', '678245',
  '901578', '234801', '568134', '890467', '123790', '457123', '789456', '012789', '346012', '678345',
  '901678', '234901', '568234', '890567', '123890', '457223', '789556', '012889', '346112', '678445',
  '901778', '235001', '568334', '890667', '123990', '457323', '789656', '012989', '346212', '678545',
  '901878', '235101', '568434', '890767', '124090', '457423', '789756', '013089', '346312', '678645',
  '901978', '235201', '568534', '890867', '124190', '457523', '789856', '013189', '346412', '678745',
  '902078', '235301', '568634', '890967', '124290', '457623', '789956', '013289', '346512', '678845',
  '902178', '235401', '568734', '891067', '124390', '457723', '790056', '013389', '346612', '678945',
  '902278', '235501', '568834', '891167', '124490', '457823', '790156', '013489', '346712', '679045',
  '902378', '235601', '568934', '891267', '124590', '457923', '790256', '013589', '346812', '679145',
  '902478', '235701', '569034', '891367', '124690', '458023', '790356', '013689', '346912', '679245'
];

// Get the current verification code from localStorage
export const getCurrentVerificationCode = () => {
  const currentIndex = parseInt(localStorage.getItem('verificationCodeIndex') || '0', 10);
  return VERIFICATION_CODES[currentIndex % VERIFICATION_CODES.length];
};

// Rotate to the next verification code
export const rotateVerificationCode = () => {
  const currentIndex = parseInt(localStorage.getItem('verificationCodeIndex') || '0', 10);
  const nextIndex = (currentIndex + 1) % VERIFICATION_CODES.length;
  localStorage.setItem('verificationCodeIndex', nextIndex.toString());
  return VERIFICATION_CODES[nextIndex];
};

// Verify if the entered code matches the current code
export const verifyCode = (enteredCode) => {
  const currentCode = getCurrentVerificationCode();
  return enteredCode === currentCode;
};
