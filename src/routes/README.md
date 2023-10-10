<table>
  <thead>
    <tr>
      <th>Метод</th>
      <th width="150px">Маршрут</th>
      <th>Описание</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>GET</code></td>
      <td><code>/posts</code></td>
      <td>возвращает массив <code>id[]</code> последних 100 новостей</td>
    </tr>
    <tr>
      <td><code>GET</code></td>
      <td><code>/post?id={id}</code></td>
      <td>Возвращает объект новостного поста с деревом коментариев, в каждом узле которого содержится информация о количестве дочерних узлов
      </td>
    </tr>
    <tr>
      <td><code>GET</code></td>
      <td><code>/item?id={id}</code></td>
      <td>Возвращает объект по его <code>id</code></td>
    </tr>
  </tbody>
</table>