Celem projektu jest stworzenie aplikacji pozwalającej na zarządzanie ogłoszeniami online - tablica ogłoszeń.

Każde ogłoszenie ma:

    tytuł
    opis
    autora
    kategorię (jedną)
    tagi (jeden lub więcej)
    cenę
  

Interfejs graficzny nie jest wymagany. Funkcjonalność będzie sprawdzona przy pomocy Postmana. Należy pamiętać o obsłudze błędów, nazewnictwie endpointów, obsłudze metod HTTP oraz zwracanych kodów odpowiedzi HTTP.

Lista funkcji:

    Aplikacja jest udokumentowana za pomocą Postmana - kolekcją zawierającą przykłady żądań do wszystkich przygotowanych funkcji.

     Port z którego korzysta aplikacja powinien być ustawiany za pomocą zmiennych środowiskowych.

      Na żądania wysłane pod adres /heartbeat aplikacja odpowiada zwracając aktualną datę i godzinę.

      Aplikacja umożliwia dodawanie ogłoszenia.

    Aplikacja umożliwia zwracanie pojedynczego ogłoszenia. W zależności od nagłówka żądania Accept dane są zwracane w odpowiednim formacie (przykładowe nagłówki: text/plain, text/html, application/json). Można wykorzystać funkcję Express res.format().

     Aplikacja umożliwia zwracanie wszystkich ogłoszeń.

      Aplikacja umożliwia usuwanie wybranego ogłoszenia.

   Aplikacja umożliwia modyfikowanie wybranego ogłoszenia.

  Aplikacja pozwala na wyszukiwanie ogłoszeń według różnych kryteriów (tytuł, opis, zakres dat, zakres cen itp).

     Aplikacja zapisuje ogłoszenia w bazie danych 

      Usuwanie i modyfikowanie ogłoszeń jest zabezpieczone hasłem, przy braku dostępu zwracany jest stosowny komunikat i kod odpowiedzi HTTP. Nie jest wymagane zabezpieczenie na poziomie produkcyjnym, raczej podstawowe rozwiązanie (za wyjątkowo dobre rozwiązania możliwe dodatkowe punkty).

     Aplikacja ma 3 zdefiniowanych na stałe użytkowników. Każdy z nich może usuwać i modyfikować tylko te ogłoszenia które sam dodał> Przy braku uprawnień do wykonania operacji, zwracany jest stosowny komunikat i kod odpowiedzi HTTP.

      Po uruchomieniu z parametrem debug (np node app.js debug) aplikacja zapisuje w pliku tekstowym czas odebrania każdego żądania, metodę HTTP oraz adres na który przyszło żądanie.

     Po odebraniu żądania wysłanego na adres który nie istnieje, aplikacja powinna zwracać statyczny obrazek zamiast domyślnej strony błędu 404.

    W przypadku wystąpienia błędów aplikacji, szczegóły błędu wyświetlane są za pomocą console.log a klient dostaje stosowny komunikat i kod odpowiedzi HTTP.
