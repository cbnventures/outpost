/**
 * Lib - Totp - Base32 Alphabet.
 *
 * @since 1.0.0
 */
export type Lib_Totp_Base32Alphabet = string;

/**
 * Lib - Totp - Create Totp URI.
 *
 * @since 1.0.0
 */
export type Lib_Totp_CreateTotpUri_Secret = string;

export type Lib_Totp_CreateTotpUri_Username = string;

export type Lib_Totp_CreateTotpUri_Returns = string;

export type Lib_Totp_CreateTotpUri_Issuer = string;

export type Lib_Totp_CreateTotpUri_EncodedIssuer = string;

export type Lib_Totp_CreateTotpUri_AccountLabel = string;

/**
 * Lib - Totp - Decode Base32.
 *
 * @since 1.0.0
 */
export type Lib_Totp_DecodeBase32_Secret = string;

export type Lib_Totp_DecodeBase32_Returns = Buffer;

export type Lib_Totp_DecodeBase32_Bits = number;

export type Lib_Totp_DecodeBase32_Value = number;

export type Lib_Totp_DecodeBase32_Values = number[];

export type Lib_Totp_DecodeBase32_CharacterValue = number;

/**
 * Lib - Totp - Encode Base32.
 *
 * @since 1.0.0
 */
export type Lib_Totp_EncodeBase32_Bytes = Buffer;

export type Lib_Totp_EncodeBase32_Returns = string;

export type Lib_Totp_EncodeBase32_Bits = number;

export type Lib_Totp_EncodeBase32_Value = number;

export type Lib_Totp_EncodeBase32_Result = string;

/**
 * Lib - Totp - Generate Code.
 *
 * @since 1.0.0
 */
export type Lib_Totp_GenerateCode_Secret = string;

export type Lib_Totp_GenerateCode_Step = number;

export type Lib_Totp_GenerateCode_Returns = string;

export type Lib_Totp_GenerateCode_SecretBytes = Buffer;

export type Lib_Totp_GenerateCode_Counter = Buffer;

export type Lib_Totp_GenerateCode_Digest = Buffer;

export type Lib_Totp_GenerateCode_Offset = number;

export type Lib_Totp_GenerateCode_BinaryCode = number;

export type Lib_Totp_GenerateCode_Code = number;

/**
 * Lib - Totp - Generate Totp Secret.
 *
 * @since 1.0.0
 */
export type Lib_Totp_GenerateTotpSecret_Returns = string;

export type Lib_Totp_GenerateTotpSecret_RandomValue = Buffer;

/**
 * Lib - Totp - Verify Totp Code.
 *
 * @since 1.0.0
 */
export type Lib_Totp_VerifyTotpCode_Secret = string;

export type Lib_Totp_VerifyTotpCode_Code = string;

export type Lib_Totp_VerifyTotpCode_Now = number;

export type Lib_Totp_VerifyTotpCode_Returns = number | undefined;

export type Lib_Totp_VerifyTotpCode_Step = number;

export type Lib_Totp_VerifyTotpCode_ProvidedBuffer = Buffer;

export type Lib_Totp_VerifyTotpCode_CandidateStep = number;

export type Lib_Totp_VerifyTotpCode_ExpectedCode = string;

export type Lib_Totp_VerifyTotpCode_ExpectedBuffer = Buffer;
