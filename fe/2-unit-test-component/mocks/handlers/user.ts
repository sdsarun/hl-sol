import { User } from '@/components/user-profile';
import { http, HttpResponse } from 'msw'
 
export const handlers = [
  http.get('https://api.example.com/users/:userId', ({ params }) => {
    const { userId } = params;

    const mockUsers: User[] = [
      {
        userId: "U0001",
        name: "Sarun Daunghirun",
        email: "sdsarun@outlook.com"
      },
      {
        userId: "U0002",
        name: null,
        email: null,
      }
    ];

    const targetUser = mockUsers.find((user) => user.userId === userId);
    if (!targetUser) {
      return HttpResponse.json({ error: "User not found" }, { status: 404 });
    }

    return HttpResponse.json(targetUser);
  }),
]