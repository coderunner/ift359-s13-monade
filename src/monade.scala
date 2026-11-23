trait Monade[F[_]]:
  def pure[A](a: A): F[A]
  def flatMap[A, B](fa: F[A])(f: A => F[B]): F[B]

  // map est dérivé automatiquement de flatMap et pure
  def map[A, B](fa: F[A])(f: A => B): F[B] =
    flatMap(fa)(a => pure(f(a)))

def sequence[F[_], A](liste: List[F[A]])(using M: Monade[F]): F[List[A]] =
  liste.foldRight(M.pure(List.empty[A])): (courant, acc) =>
    M.flatMap(courant) { valeur =>
      M.map(acc) { valeurs =>
        valeur :: valeurs
      }
    }

// Instance pour Option[_]
given Monade[Option] with
  def pure[A](a: A): Option[A] = Some(a)
  def flatMap[A, B](fa: Option[A])(f: A => Option[B]): Option[B] = fa.flatMap(f)

// Instance pour List[_]
given Monade[List] with
  def pure[A](a: A): List[A] = List(a)
  def flatMap[A, B](fa: List[A])(f: A => List[B]): List[B] = fa.flatMap(f)