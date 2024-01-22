/**
 * 만들려는 기능
 *
 * 1) registerWithEmail
 *      - email, nickname, password를 입력받고 사용자를 생성
 *      - 생성이 완료되면 accessToken과 refreshToken을 반환한다.
 *        회원가입 후 다시 로그인해주시요 <- 방지하기 위해서 둘다 반환.
 *        바로 로그인 되게끔 설계.
 *
 * 2) loginWithEmail
 *      - email, password를 입력하면 사용자 검증을 진행한다.
 *      - 검증이 완료되면 accessToken과 refreshToken을 반환한다.
 *
 * 3) loginUser
 *      - (1)과 (2) 에서 필요한 acessToken과 refreshToken을 반환하는 
 *
 * 4) signToken ( 토큰생성 로직 )
 *      -(3)에서 필요한 accessToken과 refreshToken을 sign하는 로직
 *
 * 5) authenticateWithEmailAndPassword
 *      =(2) 에서 로그인을 할 때 필요한 기본적인 검증
 *        1. 사용자가 존재하는지 확인 (email)
 *        2. 비밀번호가 맞는지 확인
 *        3. 모두 통과되면 찾은 사용자 정보 반환
 *        4. loginWithEmail에서 반환된 데이터 기반 토큰 생성
 */
/**
 * Payload에 들어갈 정보
 *
 * 1) email
 * 2) sub -> id
 * 3) type : 'access' | 'refresh'
 */

/**
 * 토큰을 사용하는 방식
 *
 * 1) 사용자 로그인 또는 회원가입 진행시 accessToken reFreshToken을 
 *    발급받는다.
 * 
 * 2) 로그인 시 Basic 토큰과 함께 요청을 보낸다.
 *    Basic 토큰은 '이메일, 비밀번호'를 Base64로 인코딩한 형태.
 * 
 * 3) 아무나 접근할 수 없는 정보(private route)를 접근할 시에 
 *    accessToken을 Header에 추가해서 요청과 함께보낸다.
 * 
 * 4) 토큰과 요청을 받은 서버는 토큰 검증을 통해 현재 요청을 보낸 사용자가
 *    누구인지 알 수 있다.
 *
 * 5) 모든 토큰은 만료기간이 있다. 만료기간이 지나면 새로운 토큰을 발급
 *    받아야 한다. 그렇지않으면 jwtService.verify()에서 인증이
 *    가로막힌다.
 *
 *   그러니 access토큰을 새로 발급 받을 수 있는 /auth/token/access 과
 *   refresh 토큰을 새로 발급 받을 수 있는 /auth/token/refresh가
 *   필요하다.
 *
 * 6) 토큰이 만료되면 각각의 토큰을 새로 발급 받을 수 있는 엔드포인트에
 *    요청을 해서 새로운 토큰을 발급받고 새로운 토큰을 사용해서 private
 *    route에 접근한다.
 */
