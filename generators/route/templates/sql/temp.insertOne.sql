/*
Inserts one <%= nameCapitalized %> into the Temp<%= nameCapitalized %> table.
*/

INSERT INTO [dbo].[Temp<%= nameCapitalized %>] (
      [@url]
    , [Name]
    )
VALUES (
    @url
  , @name
  );
