/**
 *  @swagger
 *   components:
 *     schemas:
 *       Application:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *           name:
 *             type: string
 *           description:
 *             type: string
 *           createdAt:
 *             type: string
 *           updatedAt:
 *             type: string
 *           status:
 *             type: string
 *           app_status:
 *             type: string
 *           field:
 *             type: string
 *           reviews:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Review'
 *           hasFile:
 *             type: boolean
 *           usersApplications:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/UsersApplication'
 *
 *       UsersApplication:
 *         type: object
 *         properties:
 *           role:
 *             type: string
 *           application:
 *             type: object
 *             $ref: '#/components/schemas/Application'
 *           user:
 *             type: object
 *             $ref: '#/components/schemas/User'
 *       Review:
 *         type: object
 *         properties:
 *           comment:
 *             type: string
 *           status:
 *             type: string
 *           is_feedback:
 *             type: boolean
 *           user:
 *             type: object
 *             $ref: '#/components/schemas/User'
 *       User:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *             description: The auto-generated id of the book.
 *           email:
 *             type: string
 *             description: The title of your book.
 *           name:
 *             type: string
 *             description: Name of person
 *           role:
 *             type: string
 *             description: User's role
 *           bio:
 *             type: string
 *             description: User's bio
 *           avatar:
 *             type: string
 *             description: User's avatar url
 *           app_connection:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/UsersApplication'
 *           reviews:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Review'
 *           createdAt:
 *             type: string
 *             format: date
 *             description: The date of user creation.
 *           updatedAt:
 *             type: string
 *             format: date
 *             description: The date of last information update.
 *         example:
 *            name: Joe Brogan
 *            email: mail@mail.com
 *            role: REVIEWER
 *            createdAt: 2020-01-01T00:00:00.000Z
 *            updatedAt: 2020-01-01T00:00:00.000Z
 *       UserPermission:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *           role:
 *             type: string
 *  @swagger
 *    tags:
 *      - Users
 *      - Applications
 *      - Reviews
 *      - Admin
 *      - Other
 */
