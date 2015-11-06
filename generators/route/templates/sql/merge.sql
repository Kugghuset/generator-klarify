/*
Slowly Changing Dimensions for the <%= nameCapitalized %> table.
This merges from Temp<%= nameCapitalized %> into <%= nameCapitalized %>,
and upon change disables the old row and inserts a new row.
*/


INSERT INTO [dbo].[<%= nameCapitalized %>] (
    [@url]
  , [Name]
  )
SELECT
    [@url]
  , [Name]
FROM (
  MERGE [dbo].[<%= nameCapitalized %>] AS [Target]
  USING [dbo].[Temp<%= nameCapitalized %>] AS [Source]
    ON [Target].[@url] = [Source].[@url]
    AND [Target].IsCurrent = 1
  WHEN MATCHED AND (
      [Target].[@url] != [Source].[@url]
   OR [Target].[Name] != [Source].[Name]
    )
    THEN UPDATE SET
        [IsCurrent] = 0
      , [EndDate] = GETUTCDATE()
      , [LastUpdated] = GETUTCDATE()
  WHEN NOT MATCHED BY TARGET
    THEN INSERT (
        [@url]
      , [Name]
    ) VALUES (
        [Source].[@url]
      , [Source].[Name]
    )
  WHEN NOT MATCHED BY SOURCE AND [Target].[IsCurrent] = 1
    THEN UPDATE SET
        [IsCurrent] = 0
      , [EndDate] = GETUTCDATE()
      , [LastUpdated] = GETUTCDATE()
  OUTPUT $action AS [Action]
    , [Source].*
  ) AS [MergeOutput]
    WHERE [MergeOutput].[Action] = 'Update'
    AND [<%= nameCapitalized %>Number] IS NOT NULL
;