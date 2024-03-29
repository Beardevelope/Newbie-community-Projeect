import { join } from 'path';

// 서버 프로젝트의 루트 폴더
export const PROJECT_ROOT_PATH = process.cwd();
// 외부에서 접근 가능한 파일들을 모아둔 폴더이름
export const PUBLIC_FOLDER_NAME = 'public';
// 포스트 이미지를 저장할 폴더 이름
export const PROFILE_FOLDER_NAME = 'profile';

// 실제 공개 폴더의 절대 경로
// /{프로젝트의 위치}/public
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);

// 이미지를 저장할 폴더
// /{프로젝트의 위치}/public/profile
export const PROFILE_IMAGE_PATH = join(PUBLIC_FOLDER_NAME, PROFILE_FOLDER_NAME);

// 절대경로 x
// http://loclahost:3000/public/profile/xxx.jpg

export const PROFILE_PUBLIC_IMAGE_PATH = join(PUBLIC_FOLDER_NAME, PROFILE_FOLDER_NAME);
