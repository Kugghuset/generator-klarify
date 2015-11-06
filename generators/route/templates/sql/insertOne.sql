/*
Inserts one <%= nameCapitalized %> into the <%= nameCapitalized %> table.
*/

INSERT INTO [dbo].[<%= nameCapitalized %>] (
      [@url]
    , [Name]
    )
VALUES (
    @url
  , @name
  );
