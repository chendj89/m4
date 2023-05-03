import request from "@/utils/fetch";

/**
 * 创建仓库
 * @param repoName 仓库
 */
export async function createRepo(repoName: string) {
  return request("POST /user/repos", {
    body: JSON.stringify({
      name: repoName,
    }),
  });
}
/**
 * 删除仓库
 * @param repoName 仓库
 */
export async function delRepo(repoName: string) {
  return request(`DELETE /repos/{owner}/{repo}`, {
    owner: "chendj89",
    repo: repoName,
  });
}

export interface Menu {
  name: string;
  icon: string;
  url: string;
  desc: string;
  sort: number;
  badge: string;
  affix?: boolean;
  children?: Menu[];
}

interface CreateIssue {
  repo: string;
  title: string;
  body: string | Menu;
  labels: string[];
}

/***
 * 创建问题
 */
export async function createIssue(opts: CreateIssue) {
  return request("POST /repos/{owner}/{repo}/issues", {
    owner: "chendj89",
    repo: opts.repo,
    body: JSON.stringify({
      title: opts?.title,
      body: JSON.stringify(opts?.body, null, 2),
      labels: opts?.labels,
    }),
  });
}

interface UpdateVersion {
  repo: string;
  body: string;
}

/***
 * 更新版本
 */
export async function updateVersion(opts: UpdateVersion) {
  return request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
    owner: "chendj89",
    repo: opts.repo,
    issue_number: 1,
    body: JSON.stringify({
      body: opts.body,
    }),
  });
}

/***
 * 创建问题
 */
export async function createComment(opts: any) {
  return request("POST /repos/{owner}/{repo}/issues/{issue_number}/comments", {
    owner: "chendj89",
    repo: opts.repo,
    issue_number: 1,
    body: JSON.stringify({
      body: JSON.stringify(opts?.body, null, 2),
    }),
  });
}

/**
 * 
 * @param opts 
 * @returns 
 */
export async function listIssues(opts: any) {
  return request("GET /repos/{owner}/{repo}/issues", {
    owner: "chendj89",
    repo: opts.repo,
  });
}
