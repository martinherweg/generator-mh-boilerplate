@include('_parts.site-header')

<div class="flex-center position-ref full-height">
    @yield('content')
</div>

@include('_webpack.webpack-scripts')
@yield('javascript')

</body>
</html>
