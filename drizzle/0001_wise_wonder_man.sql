CREATE TABLE "decks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"anki_deck_id" bigint,
	"last_changed_at" timestamp DEFAULT now() NOT NULL,
	"last_synced_at" timestamp
);
--> statement-breakpoint
CREATE UNIQUE INDEX "decks_name_unique" ON "decks" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "decks_anki_deck_id_unique" ON "decks" USING btree ("anki_deck_id");