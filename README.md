![title](https://teamsparta.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F83c75a39-3aba-4ba4-a792-7aefe4b07895%2Faff2a68d-3d21-46fa-9589-63354dd4c528%2F%25EC%25A0%259C%25EB%25AA%25A9_%25EC%2597%2586%25EC%259D%258C.png?table=block&id=56f62e0d-969f-42c6-9d30-83f2d288f1a3&spaceId=83c75a39-3aba-4ba4-a792-7aefe4b07895&width=2000&userId=&cache=v2)

## 👉 목차

1. [ 🏬 프로젝트 소개]
2. [ 🛠 기술 스택]
3. [ 😙 '방구석개발자' 프로젝트 구성 **인원** 및 **TASK**]
4. [👉 ERD]

</br>

## 🏬 프로젝트 소개

-   **방구석개발자**는 **초보개발자**를 위해 만들었습니다.
-   **Q&A게시판**을 통해 **쉽게** 정보를 주고받을 수 있습니다.
-   **TOY PROJECT** 구성원도 **편리**하게 구할 수 있습니다.

</br>

## ✨ 배포 링크

-   **https://newveloper.com**

</br>

## 🛠 기술 스택

<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
<img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white">
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
<img src="https://img.shields.io/badge/amazonec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white">
<img src="https://img.shields.io/badge/postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white">
<img src="https://img.shields.io/badge/elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white">
<img src="https://img.shields.io/badge/OAUTH2.0-4285F4?style=for-the-badge&logo=google&logoColor=white">
<img src="https://img.shields.io/badge/openai-412991?style=for-the-badge&logo=openai&logoColor=white">
<img src="https://img.shields.io/badge/dbeaver-382923?style=for-the-badge&logo=dbeaver&logoColor=white">

</Br>

## 😙 '방구석개발자' 프로젝트 구성 **인원** 및 **TASK**

| 이름   | blog                              | TASK                                                                                                      |
| ------ | --------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 민찬기 | https://velog.io/@beardevelop     | USER API, 인증 인가(Nest Mailer) 및 Multer 이용 이미지, 파일 업로드 기능구현, 코드 리팩토링 및 모듈화작업 |
| 조민희 | https://minhee5766.tistory.com/   | QnA 게시판 기본 CRUD API 구현, Elastic Search를 이용한 검색엔진 구현, SSE 알람 구현, 경고 시스템 API 구현 |
| 노시원 | https://velog.io/@nohsiwon/posts  | Toy Project 게시판 API, 데이터베이스,FE Toy Project 페이지 및 데이터 연결 ,FE 전반적인 css 작업           |
| 박지혜 | https://mybluesummer.tistory.com/ | banner, comment CRUD API 기능, multer 초기로직 구현, FE 배너 랜덤 출력, SSE 알림 구현                     |
| 이한빛 | https://velog.io/@harley091/posts | QnA 게시판 gpt API 챗봇 구현, FE 전반적인 수정, 보조, AWS ec2 배포                                        |

</Br>

## 👉 ERD

![onealog](https://teamsparta.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F83c75a39-3aba-4ba4-a792-7aefe4b07895%2Fbd8982cf-1fc2-4fd6-9af3-9f48367e4231%2Ferd.png?table=block&id=d36e6007-106f-45a9-832a-f593ccd2cbe7&spaceId=83c75a39-3aba-4ba4-a792-7aefe4b07895&width=2000&userId=&cache=v2)

</Br>

## 👉 서비스 아키텍쳐

![title](https://teamsparta.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F83c75a39-3aba-4ba4-a792-7aefe4b07895%2F82dd822c-0d7c-4c36-bdd3-928f75bed050%2F%25EC%2584%259C%25EB%25B9%2584%25EC%258A%25A4_%25EC%2595%2584%25ED%2582%25A4%25ED%2585%258D%25EC%25B3%2590.jpg?table=block&id=b2e81983-1eb4-4d9c-bce2-c0d1d2122196&spaceId=83c75a39-3aba-4ba4-a792-7aefe4b07895&width=1920&userId=&cache=v2)

</Br>

## 🙋‍♀️ 기술적 의사 결정

<details>
<summary>메일 인증을 위한 NPM 라이브러리 선택(’MAILER’)</summary>
<div markdown="1">

-   메일 인증 VS SMS인증 에서 이메일 인증을 선택한 이유

    **1**. 개인정보에 대한 정책 설정중 **개인정보를 최소화** 하기 위해. (이름, 연락처 필요 X)

    **2**. 프로젝트 정책에서 기능에 대한 부분은 **가볍게** 사용이 필요하며, 특정 기능에 대한 부분만

         최소한의 인가 장치가 필요. 해당 프로젝트를 이용하기에 이메일 인증은 필수가 아닌

         TOYPROJECT 게시판 이용에 필요한 인증으로 최소한의 **선택적 인가**를 채택.

1. 인증에 필요한 연락처 및 실명은 완전한 개인정보로써, 유출시 피해가 클 수 있지만 단순한

    이메일 인증을 통한 토큰 전달에는 토큰 탈취시에도 개인 실명 및 정보가 유출될 염려가

    적다고 판단.

</div>
</details>

<details>
<summary>소셜 로그인 기능을 통한 간단한 회원가입 및 로그인 ‘OAUTH 2.0’ 도입</summary>
<div markdown="1">

-   최대한 **가벼운** 커뮤니티 및 서비스 이용을 이끌어 내기 위하여 **소셜로그인** 기능을 도입.

-   **OAUTH2.0**을 통한 회원가입 시 해당 이메일에 대한 정보가 DATABASE에 없으면 Google에

-   기재된 본인의 이름 및 닉네임과 email로 DB에 저장되게 되어 회원가입 > 로그인 순인 기존

-   방식 대비 **간단하고 가볍**게 서비스를 가입 및 이용이 가능.

-   사용자의 직접적인 정보 (Email, password)를 받는 시스템은 중간에 해당 정보 탈취시에 피해가 막대해질 수 잇으므로, **단순한 접근 권한만 위임** 하는 방식으로 처리되는 표준 프로토콜 이용

</div>
</details>

<details>
<summary>검색기준 완화를 위한 ‘Elastic Search’ 도입</summary>
<div markdown="1">

-   다양한 검색 기능: 풍부한 검색 기능과 다양한 검색 요구사항을 처리가능

        - Q&A검색 시 정확한 단어, 띄어쓰기로 인한 엄격한 검색기준은 사용자의 편의를 해칠

          우려가 있어 Full text 기반으로 색인되는 elasticsearch를 이용한 검색기준의 완화

-   확장성: 수평적 확장이 가능하며, 새로운 노드를 추가하여 클러스터의 성능을 간편하게 향상

    -   데이터 및 작업을 여러 노드에 분산함으로써 시스템은 더 많은 트래픽과 데이터를

        용이하게 처리 가능

-   개방성: RESTful API를 통해 데이터에 접근하고 상호작용을 할 수 있어 다양한 플랫폼과 언어에서 쉽게 통합 가능

    -   api는 http기반이며, json 형식으로 데이터를 주고 받기 때문에 다양한 플랫폼과 언어에서

        Elastic Search와 통합이 용이

</div>
</details>

<details>
<summary>Chat GPT API를 사용한 자동 응답 챗 봇</summary>
<div markdown="1">

자동 응답 챗봇을 ChatGPT를 사용하여 구현, 특정 시간에 댓글이 게시되지 않을 때 자동으로 실행됩니다!

Chat GPT API는 npm에서도 지원하여 ‘openai’ 패키지를 사용하여 제공해주는 지침대로 사용하고 있습니다.

해당 모델로서 토큰 가성비가 좋은 ‘3.5 turbo’ 모델을 사용 중이며, 실제 50개 이상의 언어를 지원하여 사용자 친화적인 답변을 드릴 수 있습니다!

</div>
</details>

</Br>

## 🫠 트러블슈팅

<details>
<summary>wysiwyg 적용 시 XSS공격에 취약한 보안 문제점</summary>
<div markdown="1">

문제점: 위지위그 적용시 ‘크로스 사이트 스크립팅(XSS) 공격’에 취약

해결 방안:
![onealog](https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F83c75a39-3aba-4ba4-a792-7aefe4b07895%2Fc6e72bd8-fcae-46c9-ba39-66b077dd3174%2F%25ED%258A%25B8%25EB%259F%25AC%25EB%25B8%2594%25EC%258A%2588%25ED%258C%2585.jpg?table=block&id=e828ffc8-6590-4789-802c-de9cc9440e3b&spaceId=83c75a39-3aba-4ba4-a792-7aefe4b07895&width=2000&userId=d7a2fff5-85a5-477a-a8da-a0992ac08530&cache=v2)

1. HTML을 이스케이프함으로써 사용자가 입력한 HTML이 실행되지 않고 텍스트로 처리하여

    방어적인 조치

2. helmet은 기본적인 보안 헤더를 설정하기 위한 미들웨어. 다양한 보안 측면을 강화하기

    위해 사용되며 일부 XSS공격을 방지

</div>
</details>

<details>
<summary>EMAIL인증 시 redirection URL에 userId 노출</summary>
<div markdown="1">

문제 발생 : email 인증시 리다이렉션 url에 직접적인 url 노출로 인하여 타인이 userId만 알면 이메일 인증을 손쉽게 할 수 있는 문제가 발생

![onealog](https://teamsparta.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F83c75a39-3aba-4ba4-a792-7aefe4b07895%2Fe62c8c8c-71c1-41ca-939e-1eb7f1ce04fe%2FUntitled.png?table=block&id=29ce951c-7f4b-4cd7-acb5-7d966dca4358&spaceId=83c75a39-3aba-4ba4-a792-7aefe4b07895&width=2000&userId=&cache=v2)

( 실제로 const url = 부분을 확인해본다면 verify/${userId} 가 직접적으로 노출되어 이부분을 어떻게 처리해야 다른 유저 혹은 본인이 임의적으로 수정할 수 없는지에 대해서 고민하였다)

해결방안 : 완벽한 해결은 아닐 수 있으나, 아예 TOKEN값을 보내주도록 처리하였다.

![onealog](https://teamsparta.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F83c75a39-3aba-4ba4-a792-7aefe4b07895%2Ff6070116-2024-4e63-8050-5bc8afc8aaf9%2FUntitled.png?table=block&id=d48e8178-6995-49bc-942c-7b6bc0c2e4cb&spaceId=83c75a39-3aba-4ba4-a792-7aefe4b07895&width=2000&userId=&cache=v2)

중요한 점은 token에는 user password등 해킹의 우려가 있는 정보는 배제한 userId와 email만주어 userId와 email을 비교 일치하지 않으면 인증이 되지않게끔 처리를 하였다.

\*\* Q. 난수를 만들어서 처리할 수도 있었는데 그렇게 하지 않은 이유는?

A. 랜덤한 수를 직접 만들어 난수를 DB에 직접 저장하여 비교하는 방식도 고려해 본 적이 있다.

![onealog](https://teamsparta.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F83c75a39-3aba-4ba4-a792-7aefe4b07895%2F132494e8-d877-42cd-a765-c6335937b788%2FUntitled.png?table=block&id=4386f4fc-0d12-48eb-9d38-81461245facb&spaceId=83c75a39-3aba-4ba4-a792-7aefe4b07895&width=2000&userId=&cache=v2)

(랜덤한 토큰을 만들어보는건 어떨까? 하며)

다만 우리가 생성하는 인증에 대한 Token값에는 민감한 password나 개인정보가 포함되어있지 않으며, UserId를 받지 않는 이유는 타인이 남의 id에 인증회원 절차를 먹일 수 있는 부분이 문제가 되었으며 실제로 개인정보가 없는 token이지만, 타인은 다른 유저의 token을 알 수 없는 부분이기에 토큰값을 돌려주는 식으로 처리해도 처한 문제의 해결이 충분한 부분이 있어 userId대신 Token값으로 처리를 하여 문제를 해결하게 되었다.

</div>
</details>

<details>
<summary>기존 DB와 엘라스틱 서치와 동기화하는 문제점</summary>
<div markdown="1">

문제점: 게시글 생성할 때 데이터를 인덱싱 하도록 초반 설계를 했는데 이렇게 설정할 경우
사용자가 게시글 수정,삭제를 할 경우 어떻게 업데이트를 할지 고민.
해결방안: 게시글 수정, 삭제할 때 searchService에 있는 함수에 해당 데이터를 입력함으로써
실시간으로 업데이트가 될 수 있도록 설정
// 게시글 수정
async update(postId: number, updatePostDto: UpdatePostDto, userId, file: any) {
const { title, content, tag } = updatePostDto;

        const foundPost = await this.postRepository.findOne({
            where: {
                deletedAt: null,
                id: postId,
            },
        });

        if (!foundPost) {
            throw new NotFoundException('해당 게시물은 존재하지 않습니다.');
        }

        if (userId !== foundPost.userId) {
            throw new NotAcceptableException('수정할 권한이 없습니다.');
        }

        const url = file ? await this.uploadService.uploadFile(file) : null;
        const tagArray = tag.split(',');

        const tags = [];
        for (let i = 0; i < tagArray.length; i++) {
            let existedTag = await this.tagRepository.findOne({
                where: { name: tagArray[i] },
            });

            if (!existedTag) {
                tags.push({ name: tagArray[i] });
            }
            tags.push(existedTag);
        }

        const updatePost = await this.postRepository.save({
            id: postId,
            title,
            content,
            image: url,
            tags,
        });

        this.searchService.update('posts', postId, updatePost);

        return updatePost;
    }

    // 게시글 삭제
    async remove(postId: number, userId) {
        const foundPost = await this.postRepository.findOne({
            where: {
                deletedAt: null,
                id: postId,
            },
        });

        if (!foundPost) {
            throw new NotFoundException('해당 게시물은 존재하지 않습니다.');
        }

        if (userId !== foundPost.userId) {
            throw new NotAcceptableException('수정할 권한이 없습니다.');
        }

        await this.postRepository.delete(postId);

        this.searchService.remove('posts', postId);

        return foundPost;
    }

</div>
</details>

<details>
<summary>같은 기능 사용 / 다른 에러</summary>
<div markdown="1">

각자의 CRUD 및 각자의 영역에서 기능 개발을 할 때, 공통적으로 쓰이는 모듈들이 있으나 각자 개발로 인하여 같은 기능을 함에도 불구하고 상이한 에러로 git merge시에 에러들이 발생하기 시작(충돌 및 모듈 에러)

해결방안 :

![onealog](https://teamsparta.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F83c75a39-3aba-4ba4-a792-7aefe4b07895%2Fd5c50bd7-7f14-4958-a430-0a972a886222%2FUntitled.png?table=block&id=abfe47dc-264e-468a-9b5e-1ce4d7d2ddcf&spaceId=83c75a39-3aba-4ba4-a792-7aefe4b07895&width=2000&userId=&cache=v2)

엘라스틱 서치, multer, oauth, alarm(sse), mailer등 혹시모르게 사용할 수 있는 부분이 있으면

부품화(모듈화)를 통하여 간편하게 당겨서 사용하며 에러가 발생시에 모두가 동일한 에러코드를 볼 수 있도록 조치.

</div>
</details>

<details>
<summary>엘라스틱 서치 업데이트 에러</summary>
<div markdown="1">

문제 : 게시글을 수정하고 엘라스틱서치에 업데이트를 할 때 서버에러가 발생

원인: 데이터를 업데이트 할 때 마다 tag의 타입 문제로 업데이트가 되지
않는 문제가 발생

해결: 엘라스틱서치에서 사용되는 스크립트 언어 중 하나인 'painless'를 사용하여 해결

![onealog](https://teamsparta.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F83c75a39-3aba-4ba4-a792-7aefe4b07895%2Fad298c23-9a92-4302-a1ea-966534b408b4%2F%25EC%2597%2598%25EB%259D%25BC%25EC%258A%25A4%25ED%258B%25B1%25ED%258A%25B8%25EB%259F%25AC%25EB%25B8%2594%25EC%258A%2588%25ED%258C%2585.png?table=block&id=283d03ef-89fe-4a9e-b559-67871560884d&spaceId=83c75a39-3aba-4ba4-a792-7aefe4b07895&width=2000&userId=&cache=v2)

ctx.\_source.remove('tags') 를 통하여 'tags' 필드를 제거하고
ctx.\_source.tags = params.newTags 를 통하여 새로운 'tags' 값을 할당하여 해결

</div>
</details>

</Br>

## 🎈 코드 샘플 및 주석

<details>
<summary>MAILER / NestJs 이메일 인</summary>
<div markdown="1">

// Mailer config
import { registerAs } from '@nestjs/config';
import { config } from 'dotenv';

config();

// email을 보내는 주체 및 해당 서비스의 정보를 저장하는 config

export default registerAs('mailer', () => ({
smtp: 'smtp.gmail.com',
smtp_id: process.env.GOOGLE_APP_EMAIL,
smtp_pw: process.env.GOOGLE_APP_PASSWORD,
smtp_ssl: true,
smtp_port: 587,
smtp_from_name: '<본인인증맨>',
smtp_from_email: process.env.GOOGLE_EMAIL,
privkey: 'supertest',
}));

---

// mailer.controller.ts
@Controller('mail')
export class EmailController {
constructor(private readonly emailService: EmailService) {}

    /**
     * 메일 인증 엔드포인트
     * @param req
     * @param email
     * @returns
     */

    @UseGuards(AccessTokenGuard)
    @Post('send-verification-email')
    async sendVerificationEmail(
        @Req() req: Request,
        @Body('email') email: string,
    ): Promise<{ message: string }> {
        await this.emailService.sendVerificationEmail(email, req['userId']);

        return { message: '이메일을 성공적으로 전송했습니다.' };
    }

}

---

// mailer.servcie.ts

@Injectable()
export class EmailService {
constructor(
private readonly mailerService: MailerService,
private readonly jwtService: JwtService,
) {}

    /**
     * 인증메일 발송( +토큰 생성, 만료시간 생성)
     * @param email
     * @param userId
     */

    async sendVerificationEmail(email: string, userId: number): Promise<void> {
        const token = this.jwtService.sign(
            {
                email,
                id: userId,
            },

            // 만료시간을 줄여줄 필요가 있음.
            { expiresIn: '1h' },
        );
        // 리다이렉션 url에 email과 userId만 받는 token을 생성하여 인증처리
        const url = `http:/localhost:3000/auth/verify/${token}`;

        await this.mailerService.sendMail({
            to: email,
            subject: '방구석 개발자 회원 이메일 인증',
            html: `
            <p>아래 이미지를 클릭하여 이메일 인증을 완료하세요:</p>
            <form action=${url} method="POST">
            <button style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; cursor: pointer;">인증</button>
            </form>
        `,
        });
    }

}

</div>
</details>

<details>
<summary>Google social login (Oauth2.0)</summary>
<div markdown="1">

// google.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { config } from 'dotenv';
import { AuthService } from './auth.service';
config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
constructor(
private userService: UserService,
private authService: AuthService,
) {
super({
clientID: process.env.GOOGLE_CLIENT_ID,
clientSecret: process.env.GOOGLE_CLIENT_SECRET,
callbackURL: process.env.GOOGLE_CALLBACK_URL,
scope: ['email', 'profile'],
});
}

// validate에 대한 정의
async validate(
accessToken: string,
refreshToken: string,
profile: Profile,
done: VerifyCallback,
) {
const { id, name, emails } = profile;
console.log(accessToken, '+++++++++++++++++++++++++++++++++++');
console.log(refreshToken, '----------------------------------');
const providerId = id;

        const email = emails[0].value;

        // nickname = Google name 치환
        const nickname = name.givenName + ' ' + name.familyName;

        const password = 'oauth-password';

        let user = await this.userService.getUserByEmail(email);

        if (!user) {
            user = await this.userService.createUserByGoogle(email, nickname, password, providerId);
        }

        done(null, user);

}

---

// auth.controller.ts

/\*\*
_ 구글 로그인 주소
_ @param req
\*/
@Get('to-google')
@UseGuards(GoogleAuthGuard)
async googleAuth(@Request() req) {}

    /**
     * 직접적인 구글 로그인을 통한 리다이렉션 url 설정 및 토큰 반환 코드
     * @param req
     * @param res
     * @returns
     */
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    googleAuthRedirect(@Request() req: Request, @Res() res) {
        console.log(req['user']);
        // return this.authService.googleLogin(req);
        const token = this.authService.signToken(req['user'], false);
        res.redirect(`http://localhost:3000/Auth/save-token.html?accessToken=${token}`);
        return token;
    }

---

// auth.service.ts

/\*\*
_ 토큰발급
_ @param user
_ @param isRefreshToken
_ @returns
\*/

    signToken(user: Pick<User, 'email' | 'id'>, isRefreshToken: boolean) {
        const token = this.jwtService.sign(
            {
                sub: user.id,
                email: user.email,
                id: user.id,
                type: isRefreshToken ? 'refresh' : 'access',
            },
            { expiresIn: isRefreshToken ? '1h' : '1h' },
        );

        return token;
    }

/\*\*
_ 구글 로그인
_ @param req
_ @returns
_/

    googleLogin(req) {
        if (!req.user) {
            return ' No user from google';
        }

        return {
            message: ' User information from google',
            user: req.user,
        };
    }

</div>
</details>

<details>
<summary>SSE 알림 기능</summary>
<div markdown="1">

// SSE 알림

@Injectable()
export class AlarmService {
constructor(
@InjectRepository(Alarm)
private readonly alarmRepository: Repository<Alarm>,
) {}

    private alarms$: Subject<any> = new Subject();

    private observer = this.alarms$.asObservable();

    // 이벤트 발생 함수
    async emitAlarmAddedEvent(userId: number, title: string, description: string) {
        this.alarms$.next({ userId, title, description });
    }

    // 이벤트를 구독하는 클라이언트에게 SSE 전송
    sendAlarmAddedEvent(userId: number): Observable<any> {
        return this.observer.pipe(
            // 특정 게시물의 댓글만 필터링
            filter((event) => event.userId === userId),
            // 데이터를 SSE 형식으로 변환
            map((event) => {
                return {
                    data: {
                        title: `${event.title}`,
                        description: `${event.description}`,
                    },
                } as MessageEvent;
            }),
        );
    }

    // 알람 형성
    async createAlarm(userId: number, title: string, description: string) {
        // 알람을 여기서 저장하는 로직 작성
        const alarm = await this.alarmRepository.save({
            title,
            description,
            userId,
        });
        this.emitAlarmAddedEvent(userId, alarm.title, description)
    }

}

</div>
</details>

<details>
<summary>Elastic Search </summary>
<div markdown="1">

// Elastic Search

@Injectable()
export class SearchService {
constructor(private readonly esService: ElasticsearchService) {}

    // 인덱싱
    async indexPost(index: string, post: any) {
        return await this.esService
            .index({
                index,
                body: post,
            })
            .catch((error) => {
                console.error(
                    'Elasticsearch Create Error:',
                    error,
                    '----------------------------',
                    error.meta.body.error,
                    '----------------------------',
                );
                throw error;
            });
    }

    // 검색 기본셋팅
    async search(text: string) {
        const { body } = await this.esService.search<any>({
            index: 'posts',
            body: {
                query: {
                    multi_match: {
                        query: text,
                        fuzziness: 1,
                        fields: ['title', 'content', 'tags.name'],
                    },
                },
            },
        });

        const hits = body.hits.hits;
        console.log(body);
        console.log(body.hits);
        return hits.map((item: any) => item._source);
    }

    // 데이터 수정
    async update(index: string, postId: number, post) {
        const newTags = post.tags;

        const script = `
        ctx._source.id='${postId}';
        ctx._source.title='${post.title}';
        ctx._source.content='${post.content}';
        ctx._source.image='${post.image}';
        ctx._source.remove('tags');
        ctx._source.tags = params.newTags;
        ctx._source.updatedAt='${new Date(post.updatedAt).toISOString()}';
        `;

        this.esService
            .updateByQuery({
                index,
                body: {
                    query: {
                        match: {
                            id: postId,
                        },
                    },
                    script: {
                        inline: script,
                        lang: 'painless',
                        params: { newTags: newTags },
                    },
                },
            })
            .catch((error) => {
                console.error(
                    'Elasticsearch Update Error:',
                    error,
                    '----------------------------',
                    error.meta.body.failures,
                    '----------------------------',
                );
                throw error;
            });
    }

    // 데이터 삭제
    async remove(index: string, postId: number) {
        this.esService.deleteByQuery({
            index,
            body: {
                query: {
                    match: {
                        id: postId,
                    },
                },
            },
        });
    }

    // 매핑 정보 가져오기
    async getMapping(index: string) {
        const { body } = await this.esService.indices.getMapping({
            index,
        });

        // 필드 및 데이터 타입 정보 출력
        console.log(body[index]?.mappings.properties);
        return body[index]?.mappings;
    }

}

</div>
</details>

<br>

## 설치방법

```
npm install
npm run start:dev
```
