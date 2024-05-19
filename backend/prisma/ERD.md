```mermaid
erDiagram
	User {
		Int id PK  "autoincrement()"
		String displayName
		String imageUrl
		String password
		String email
		DateTime createdAt  "now()"
		DateTime updatedAt
	}
	Board {
		Int id PK  "autoincrement()"
		String name
		String background
		Int ownerId FK
		DateTime createdAt  "now()"
		DateTime updatedAt
	}
	List {
		Int id PK  "autoincrement()"
		String name
		Int order
		Boolean archived
		Int boardId FK
		DateTime createdAt  "now()"
		DateTime updatedAt
	}
	Card {
		Int id PK  "autoincrement()"
		String title
		String description  "nullable"
		Int order
		Boolean archived
		Int listId FK
		Int boardId FK
		DateTime createdAt  "now()"
		DateTime updatedAt
	}
	Activity {
		Int id PK  "autoincrement()"
		String text
		Int userId FK
		Int boardId FK
		DateTime createdAt  "now()"
		DateTime updatedAt
	}
	Board }o--|| User : owner
	List }o--|| Board : board
	Card }o--|| Board : board
	Card }o--|| List : list
	Activity }o--|| Board : board
	Activity }o--|| User : user

```
