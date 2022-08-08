using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DITS.Core.Enums
{
    public enum Consent
    {
        dtmf1 = 1,
        dtmf2 = -1
    }

    public enum Segmentation
    {
        dtmf1 = 1,
        dtmf2,
        dtmf3,
        dtmf4,
        dtmf5,
        dtmf6,
        dtmf7,
        dtmf8,
        dtmf9
    }

    public enum AntiCoaching
    {
        dtmf1 = 1,
        dtmf2 = -1,
        dtmf3 = 0
    }

    public enum CoreQuestions
    {
        dtmf1 = 1,
        dtmf2 = -1,
        dtmf3 = 0
    }
}
