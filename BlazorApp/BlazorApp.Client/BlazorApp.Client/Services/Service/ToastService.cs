using BlazorApp.Client.Components.Enums;
using BlazorApp.Client.Components.Toast;
using System.Timers;
using Timer = System.Timers.Timer;

namespace BlazorApp.Client.Services.Service
{
    public class ToastService
    {
        public event Action<string, ToastLevel> OnShow;
        public event Action OnHide;

        public void ShowToast(string message, ToastLevel level)
        {
            OnShow?.Invoke(message, level);
        }

        public void HideToast()
        {
            OnHide?.Invoke();
        }
    }
}
