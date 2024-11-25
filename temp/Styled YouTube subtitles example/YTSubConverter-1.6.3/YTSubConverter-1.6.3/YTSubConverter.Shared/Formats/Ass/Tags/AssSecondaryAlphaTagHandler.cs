﻿using YTSubConverter.Shared.Animations;
using YTSubConverter.Shared.Util;

namespace YTSubConverter.Shared.Formats.Ass.Tags
{
    internal class AssSecondaryAlphaTagHandler : AssTagHandlerBase
    {
        public override string Tag => "2a";

        public override bool AffectsWholeLine => false;

        public override void Handle(AssTagContext context, string arg)
        {
            int alpha = !string.IsNullOrEmpty(arg) ? 255 - (ParseHex(arg) & 255) : context.Style.SecondaryColor.A;
            context.Section.SecondaryColor = ColorUtil.ChangeAlpha(context.Section.SecondaryColor, alpha);
            context.Section.Animations.RemoveAll(a => a is SecondaryColorAnimation);
        }
    }
}
