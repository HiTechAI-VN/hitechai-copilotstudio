// Copyright (C) Pho Tue SoftWare Solutions JSC. All rights reserved.

using Microsoft.CopilotStudio.Sync;

namespace Microsoft.CopilotStudio.Sync.TestHarness;

internal sealed class ConsoleSyncProgress : ISyncProgress
{
    public void Report(string message)
    {
        Console.WriteLine($"[sync] {message}");
    }
}
