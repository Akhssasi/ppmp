import { request } from "@/services/api";
import type { Member, MemberRole } from "@/lib/types";

export const collaborationService = {
  async getMembers(projectId: string): Promise<Member[]> {
    return request<Member[]>({ url: `/projects/${projectId}/members`, method: "GET" });
  },

  async invite(projectId: string, email: string): Promise<Member> {
    return request<Member>({
      url: `/projects/${projectId}/members/invite`,
      method: "POST",
      data: { email },
    });
  },

  async removeMember(projectId: string, userId: string): Promise<void> {
    await request<void>({
      url: `/projects/${projectId}/members/${userId}`,
      method: "DELETE",
    });
  },

  async updateRole(projectId: string, userId: string, role: MemberRole): Promise<Member> {
    return request<Member>({
      url: `/projects/${projectId}/members/${userId}/role`,
      method: "PUT",
      data: { role },
    });
  },

  async acceptInvitation(token: string): Promise<void> {
    await request<void>({ url: `/invitations/${token}/accept`, method: "POST" });
  },

  async rejectInvitation(token: string): Promise<void> {
    await request<void>({ url: `/invitations/${token}/reject`, method: "POST" });
  },
};
