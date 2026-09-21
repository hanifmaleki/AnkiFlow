CREATE INDEX "cards_deck_id_index" ON "cards" USING btree ("deck_id");--> statement-breakpoint
CREATE UNIQUE INDEX "cards_anki_note_id_unique" ON "cards" USING btree ("anki_note_id");--> statement-breakpoint
CREATE INDEX "cards_prompt_id_index" ON "cards" USING btree ("prompt_id");